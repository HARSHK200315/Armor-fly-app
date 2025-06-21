import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PodChat() {
    const { podId, anonName } = useParams();
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const [progressMsg, setProgressMsg] = useState("");
    const [progressList, setProgressList] = useState([]);
    const [points, setPoints] = useState(0);
    const [uploading, setUploading] = useState(false);

    // Join pod and handle incoming messages
    useEffect(() => {
        socket.emit("joinPod", { podId });
        console.log("🛰️ Sending registerUser:", anonName);
        socket.emit("registerUser", anonName);

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        const fetchProgress = async () => {
            try {
                const res = await axios.post("https://armor-fly-app.onrender.com/api/users/create", {
                    skills: [],
                    personality: "",
                    anonymousName: anonName
                });
                setProgressList(res.data.progress || []);
            } catch (err) {
                console.error("Error fetching progress", err);
            }
        };

        fetchProgress();

        return () => socket.off("receiveMessage");
    }, [podId, anonName]);

    const sendMessage = () => {
        if (!msg.trim()) return;
        const formattedMsg = `${anonName}: ${msg}`;
        socket.emit("sendMessage", { podId, message: formattedMsg });
        setMsg("");
    };

    const submitProgress = async () => {
        try {
            const res = await axios.post("https://armor-fly-app.onrender.com/api/progress/update", {
                anonName,
                message: progressMsg,
            });
            setProgressList(res.data.user.progress);
            setProgressMsg("");
            setPoints(res.data.user.progressPoints);
        } catch (err) {
            console.error("📛 Progress submit error:", err.response?.data || err.message);
            alert("Error submitting progress");
        }
    };

    const fetchProgress = async () => {
        try {
            const res = await axios.post("https://armor-fly-app.onrender.com/api/users/create", {
                skills: [],
                personality: "",
                anonymousName: anonName
            });
            setProgressList(res.data.progress || []);
            setPoints(res.data.progressPoints || 0);

        } catch (err) {
            console.error("Error fetching progress", err);
        }
    };

    const thumbsUp = async (index) => {
        try {
            const res = await axios.post("https://armor-fly-app.onrender.com/api/progress/thumb", {
                anonName,
                index
            });
            setProgressList(res.data.user.progress);
            setPoints(res.data.user.progressPoints);
        } catch (err) {
            alert("Error giving feedback");
        }
    };
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("anonName", anonName);
        setUploading(true);
        try {
            const res = await axios.post("https://armor-fly-app.onrender.com/api/upload/image", formData);
            setProgressList(res.data.user.progress);
        } catch (err) {
            alert("Upload failed");
        }
        setUploading(false);
    };

    const handleConnectionRequest = async () => {
        try {
            const res = await axios.post("https://armor-fly-app.onrender.com/api/connection/match", {
                anonName,
            });
            alert("✅ You are matched with: " + res.data.match);
        } catch (err) {
            console.error("Match error:", err.response?.data || err.message);
            alert("❌ " + (err.response?.data?.error || "Connection failed"));
        }
    };


    return (
        <div style={{ padding: 20 }}>
            <h2>🛩️ Welcome, {anonName} — Pod {podId}</h2>
            <div style={{ marginBottom: 20 }}>
                <strong>🌟 Progress Points:</strong> {points}
                <div style={{
                    height: "20px",
                    width: "100%",
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    marginTop: "5px"
                }}>
                    <div style={{
                        height: "100%",
                        width: `${Math.min(points, 100)}%`,
                        backgroundColor: "#4caf50",
                        borderRadius: "10px",
                        transition: "width 0.3s"
                    }}></div>
                </div>
            </div>

            {points >= 100 ? (
                <div style={{ marginTop: 20 }}>
                    <h4>🔓 1:1 Connection Unlocked!</h4>
                    <button onClick={handleConnectionRequest}>
                        Connect with a learner like you
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: 20 }}>
                    <h4>🔒 Unlock 1:1 Connections at 100 points</h4>
                    <progress max="100" value={points}></progress>
                </div>
            )}


            <div style={{ height: 200, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
                <h3>💬 Pod Chat</h3>
                {messages.map((m, i) => <div key={i}>{m}</div>)}
            </div>

            <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..."
                style={{ width: "80%", padding: "5px", marginTop: 10 }}
            />
            <button onClick={sendMessage} style={{ padding: "6px 12px", marginLeft: 10 }}>Send</button>

            <hr style={{ margin: "30px 0" }} />

            <h3>📈 Share Your Progress</h3>
            <textarea
                value={progressMsg}
                onChange={(e) => setProgressMsg(e.target.value)}
                placeholder="What did you learn or complete today?"
                rows={3}
                style={{ width: "100%", padding: 10 }}
            ></textarea>
            <button onClick={submitProgress} style={{ marginTop: 10 }}>Submit Progress</button>

            <hr style={{ marginTop: 20 }} />
            <h4>📤 Upload Image Progress:</h4>
            <input type="file" accept="image/*" onChange={uploadImage} />
            {uploading && <p>Uploading...</p>}

            <h4 style={{ marginTop: 30 }}>🧾 Your Progress Updates:</h4>
            {progressList.map((item, index) => (
                <div key={index} style={{ marginBottom: 15, border: "1px solid #ddd", padding: 10 }}>
                    <strong>📌</strong> {item.message} <br />
                    👍 {item.thumbsUp}
                    <button
                        style={{ marginLeft: 10, padding: "2px 8px" }}
                        onClick={() => thumbsUp(index)}
                    >
                        Give Thumbs Up
                    </button>
                    {item.image && (
                        <div style={{ marginTop: 10 }}>
                            <img src={item.image} alt="progress" style={{ width: "100%", maxHeight: 200, objectFit: "contain" }} />
                        </div>
                    )}
                </div>
            ))}
        </div>

    );
}
