import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";

interface Consultation {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  user_id: string;
  user_profile?: {
    full_name: string;
    email: string;
    phone: string | null;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  advocate_id: string;
  profiles?: {
    full_name: string;
  };
}

const AdvocateDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [advocateId, setAdvocateId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState("");

  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAdvocateAndConsultations = async () => {
      if (!user) return;

      try {
        // First, check if user is an advocate
        const { data: advocateData, error: advocateError } = await supabase
  .from("advocates")
  .select("id,user_id")
  .eq("user_id", user.id)
  .single();

if (advocateError || !advocateData) {
  toast({
    title: "Access Denied",
    description: "You are not registered as an advocate.",
    variant: "destructive",
  });
  navigate("/");
  return;
}

console.log("ADVOCATE RECORD:", advocateData);

setAdvocateId(advocateData.user_id);

const { data: profile } = await supabase
  .from("profiles")
  .select("id")
  .eq("user_id", user.id)
  .single();

if (profile) {
  setProfileId(profile.id);
}

fetchConversations(advocateData.user_id);

        // Fetch consultations for this advocate
        const { data: consultationsData, error: consultationsError } =
          await supabase
            .from("consultations")
            .select("*")
            .eq("advocate_id", advocateData.id)
            .order("scheduled_at", { ascending: true });

        if (consultationsError) throw consultationsError;

        // Fetch user profiles for each consultation
        const consultationsWithProfiles = await Promise.all(
          (consultationsData || []).map(async (consultation) => {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("full_name, email, phone")
              .eq("user_id", consultation.user_id)
              .single();

            return {
              ...consultation,
              user_profile: profileData || undefined,
            };
          }),
        );

        setConsultations(consultationsWithProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load consultations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdvocateAndConsultations();
    }
  }, [user, navigate, toast]);

  const fetchConversations = async (advocateId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
          *,
          profiles:user_id (
            full_name
          )
        `,
      )
      .eq("advocate_id", advocateId);

      console.log("ADVOCATE ID:", advocateId);
      console.log("CONVERSATIONS DATA:", data);

    if (error) {
      console.error(error);
      return;
    }

    setConversations(data as Conversation[]);

    if (data && data.length > 0 && !selectedConversation) {
      setSelectedConversation(data[0].id);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data as Message[]);
  };

  const sendMessage = async () => {
    if (!profileId || !selectedConversation || !newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation,
      sender_id: profileId,
      message: newMessage.trim(),
    });

    if (error) {
      console.error(error);
      return;
    }

    setNewMessage("");
  };

  const updateConsultationStatus = async (
    consultationId: string,
    newStatus: "confirmed" | "cancelled",
  ) => {
    setUpdatingId(consultationId);
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: newStatus })
        .eq("id", consultationId);

      if (error) throw error;

      setConsultations((prev) =>
        prev.map((c) =>
          c.id === consultationId ? { ...c, status: newStatus } : c,
        ),
      );

      toast({
        title:
          newStatus === "confirmed"
            ? "Consultation Confirmed"
            : "Consultation Rejected",
        description:
          newStatus === "confirmed"
            ? "The client has been notified of the confirmation."
            : "The consultation has been cancelled.",
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Consultation["status"]) => {
    const variants: Record<
      Consultation["status"],
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    return (
      <Badge variant={variants[status].variant}>{variants[status].label}</Badge>
    );
  };

  const pendingConsultations = consultations.filter(
    (c) => c.status === "pending",
  );
  const upcomingConsultations = consultations.filter(
    (c) => c.status === "confirmed" && new Date(c.scheduled_at) > new Date(),
  );
  const pastConsultations = consultations.filter(
    (c) =>
      c.status === "completed" ||
      c.status === "cancelled" ||
      (c.status === "confirmed" && new Date(c.scheduled_at) <= new Date()),
  );

  useEffect(() => {
    if (!selectedConversation) return;

    fetchMessages(selectedConversation);

    const channel = supabase
      .channel(`advocate-chat-${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        () => {
          fetchMessages(selectedConversation);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            Advocate Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your consultation requests and appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">
                {pendingConsultations.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {upcomingConsultations.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {consultations.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Section */}
        {pendingConsultations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Pending Requests
            </h2>
            <div className="grid gap-4">
              {pendingConsultations.map((consultation) => (
                <Card key={consultation.id} className="border-secondary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {consultation.user_profile?.full_name ||
                              "Unknown User"}
                          </span>
                          {getStatusBadge(consultation.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "PPP")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "p")}
                          </span>
                          <span>{consultation.duration_minutes} min</span>
                        </div>
                        {consultation.notes && (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            <strong>Notes:</strong> {consultation.notes}
                          </p>
                        )}
                        {consultation.user_profile?.email && (
                          <p className="text-sm text-muted-foreground">
                            Contact: {consultation.user_profile.email}
                            {consultation.user_profile.phone &&
                              ` | ${consultation.user_profile.phone}`}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateConsultationStatus(
                              consultation.id,
                              "confirmed",
                            )
                          }
                          disabled={updatingId === consultation.id}
                        >
                          {updatingId === consultation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateConsultationStatus(
                              consultation.id,
                              "cancelled",
                            )
                          }
                          disabled={updatingId === consultation.id}
                        >
                          {updatingId === consultation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Consultations Section */}
        {upcomingConsultations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Consultations
            </h2>
            <div className="grid gap-4">
              {upcomingConsultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {consultation.user_profile?.full_name ||
                              "Unknown User"}
                          </span>
                          {getStatusBadge(consultation.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "PPP")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "p")}
                          </span>
                          <span>{consultation.duration_minutes} min</span>
                        </div>
                        {consultation.user_profile?.email && (
                          <p className="text-sm text-muted-foreground">
                            Contact: {consultation.user_profile.email}
                            {consultation.user_profile.phone &&
                              ` | ${consultation.user_profile.phone}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Past Consultations Section */}
        {pastConsultations.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
              Past Consultations
            </h2>
            <div className="grid gap-4">
              {pastConsultations.map((consultation) => (
                <Card key={consultation.id} className="opacity-70">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {consultation.user_profile?.full_name ||
                              "Unknown User"}
                          </span>
                          {getStatusBadge(consultation.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "PPP")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), "p")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex h-[600px] border rounded-xl overflow-hidden">
              <div className="w-72 border-r">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-muted ${
                      selectedConversation === conv.id ? "bg-muted" : ""
                    }`}
                  >
                    <p className="font-medium">{conv.profiles?.full_name}</p>

                    <p className="text-sm text-muted-foreground">Open Chat</p>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="border-b p-4 bg-card">
                  <h2 className="font-semibold text-lg">
                    {
                      conversations.find((c) => c.id === selectedConversation)
                        ?.profiles?.full_name
                    }
                  </h2>

                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === profileId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex mb-3 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-xl max-w-[70%] ${
                            isMine ? "bg-primary text-white" : "bg-muted"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t p-4 flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 border rounded-lg px-4 py-2"
                  />

                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {consultations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Consultations Yet</CardTitle>
              <CardDescription>
                When clients book consultations with you, they will appear here.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdvocateDashboard;
