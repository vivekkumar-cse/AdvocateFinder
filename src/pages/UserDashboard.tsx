import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>

        <p className="text-muted-foreground mb-8">
          Manage your consultations, saved advocates and profile.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* My Consultations */}
          <div
            onClick={() => navigate("/my-consultations")}
            className="border rounded-xl p-6 cursor-pointer hover:bg-muted transition hover:shadow-md"
          >
            <h2 className="font-semibold text-lg mb-2">My Consultations</h2>

            <p className="text-muted-foreground text-sm">
              View upcoming and past consultations.
            </p>
          </div>

          {/* Saved Advocates */}
          <div
            onClick={() => navigate("/saved-advocates")}
            className="border rounded-xl p-6 cursor-pointer hover:bg-muted transition hover:shadow-md"
          >
            <h2 className="font-semibold text-lg mb-2">Saved Advocates</h2>

            <p className="text-muted-foreground text-sm">
              Your bookmarked advocates.
            </p>
          </div>

          <div
            onClick={() => navigate("/messages")}
            className="border rounded-xl p-6 cursor-pointer hover:bg-muted transition"
          >
            <h2 className="font-semibold mb-2">Messages</h2>

            <p className="text-muted-foreground text-sm">
              Chat with advocates.
            </p>
          </div>

          {/* Profile Settings */}
          <div
            onClick={() => alert("Coming Soon")}
            className="border rounded-xl p-6 cursor-pointer hover:bg-muted transition hover:shadow-md"
          >
            <h2 className="font-semibold text-lg mb-2">Profile Settings</h2>

            <p className="text-muted-foreground text-sm">
              Manage your account details.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;