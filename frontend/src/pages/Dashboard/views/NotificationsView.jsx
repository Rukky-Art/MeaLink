import { Bell } from "lucide-react";

function NotificationsView() {
  const notifications = [
    "Your donation was claimed",
    "New partner joined",
    "Food delivered successfully",
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="bg-white border p-4 rounded-2xl flex items-center gap-3"
          >
            <Bell />
            <p>{n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsView;