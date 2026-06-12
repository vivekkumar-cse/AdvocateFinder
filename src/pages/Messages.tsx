import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  advocate_id: string;
  advocates: {
    profiles: {
      full_name: string;
    };
  };
}

const Messages = () => {
  const { user } = useAuth();

  const [searchParams] = useSearchParams();

  const urlConversationId = searchParams.get("conversation");

  const [messages, setMessages] = useState<Message[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(urlConversationId);

  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [profileId, setProfileId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) return;

    fetchMessages();

    const channel = supabase
      .channel(`conversation-${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("PROFILE ERROR:", error);
      return;
    }

    setProfileId(data.id);

    console.log("PROFILE:", data);

    fetchConversations(data.id);
  };

  const fetchConversations = async (profileId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        advocate_id,
        advocates (
          profiles (
            full_name
          )
        )
      `,
      )
      .eq("user_id", profileId);

    if (error) {
      console.error("CONVERSATION ERROR:", error);
      return;
    }

    console.log("CONVERSATIONS:", data);

    setConversations((data as Conversation[]) || []);
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", selectedConversation)
      .order("created_at", {
        ascending: true,
      });

    console.log("MESSAGES:", data);

    if (error) {
      console.error(error);
    } else {
      setMessages((data as Message[]) || []);
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!profileId || !selectedConversation || !newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation,
      sender_id: profileId,
      message: newMessage.trim(),
    });

    if (error) {
      console.error("SEND ERROR:", error);
      return;
    }

    setNewMessage("");
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Messages</h1>

        <p className="text-muted-foreground mb-6">
          Chat with advocates in real time.
        </p>

        <div className="border rounded-xl overflow-hidden h-[700px] flex">
          {/* Sidebar */}
          <div className="w-80 border-r bg-card">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Conversations</h2>
              <p className="text-sm text-muted-foreground">
    {conversations.length} chats
  </p>
            </div>

            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No conversations
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
  setSelectedConversation(conv.id);
  setMessages([]);
}}
                  className={`p-4 border-b cursor-pointer transition-colors ${
  selectedConversation === conv.id
    ? "bg-blue-50 border-l-4 border-l-blue-600"
    : "hover:bg-muted"
}`}
                >
                  <p className="font-medium">
                    {conv.advocates?.profiles?.full_name}
                  </p>

                  <p className="text-sm text-muted-foreground">Open Chat</p>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          {/* Chat Area */}
<div className="flex-1 flex flex-col">

  {/* Chat Header */}
  <div className="border-b p-4 bg-card">
    <h2 className="font-semibold text-lg">
      {
        conversations.find(
          (c) =>
            c.id ===
            selectedConversation
        )?.advocates?.profiles
          ?.full_name
      }
    </h2>

    <p className="text-sm text-muted-foreground">
      Online
    </p>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

    {loading ? (
                <p>Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Start the conversation.
                </p>
              ) : (
                <>

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
                          className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                            isMine
  ? "bg-blue-600 text-white shadow-sm"
  : "bg-card border shadow-sm"
                          }`}
                        >
                          <p>{msg.message}</p>

                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-4 py-2 bg-background"
              />

              <button
                onClick={sendMessage}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Messages;
