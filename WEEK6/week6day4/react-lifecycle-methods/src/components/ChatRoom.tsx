import { useEffect, useState } from "react";

const ChatRoom = () => {
  const [roomName, setRoomName] = useState("General");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});

  function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const room = formData.get("roomName") as string;
    if (typeof room === "string" && room.length <= 15 && room.length > 0) {
      setRoomName(room);
      return;
    }
    alert("Please enter valid room name");
    return;
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (cache[roomName]) {
          setMessage(cache[roomName]);
          setIsLoading(false);
          return;
        }
        const response = await fetch(
          `http://localhost:3000/chatroom?roomName=${roomName}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        const data = await response.json();
        if (!data.success) return;
        setCache((prev) => ({ ...prev, [roomName]: data.message }));
        setMessage(data.message);
      } catch (err) {
        console.error("Failed to fetch chatroom data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
      console.log("Cleaning up");
    };
  }, [roomName]);

  return (
    <div>
      <div>
        {isLoading ? <div>Loading message...</div> : <div>{message}</div>}
      </div>
      <div></div>
      <div style={{ color: "red" }}>
        <i> * Name should be less than or equal to 15 length</i>
      </div>
      <br />

      <form onSubmit={handleSubmit}>
        {/* Name attribute is required for FormData to grab it */}
        <input type="text" placeholder="Enter the Room name" name="roomName" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
