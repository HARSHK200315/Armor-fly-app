import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SkillForm() {
  const [skills, setSkills] = useState("");
  const [personality, setPersonality] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://amor-fly-api.onrender.com/api/users/create", {
        skills: [skills],
        personality,
      });
      const { podId, anonymousName } = res.data;
      navigate(`/pod/${podId || "default"}/${anonymousName}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting data");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Select Your Skill & Personality</h2>
      <form onSubmit={handleSubmit}>
        <label>Skill to Learn:</label><br />
        <input value={skills} onChange={(e) => setSkills(e.target.value)} required /><br /><br />

        <label>Personality Type:</label><br />
        <select value={personality} onChange={(e) => setPersonality(e.target.value)} required>
          <option value="">Select</option>
          <option value="calm">Calm</option>
          <option value="curious">Curious</option>
          <option value="motivated">Motivated</option>
        </select><br /><br />

        <button type="submit">Join Pod</button>
      </form>
    </div>
  );
}
