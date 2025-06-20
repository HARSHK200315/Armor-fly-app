async function matchUsersToPods() {
  const users = await User.find({ podId: null });

  // Group users by skill and personality
  const grouped = {};

  users.forEach((user) => {
    const key = `${user.skills[0]}-${user.personality}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(user);
  });

  for (const key in grouped) {
    const group = grouped[key];
    while (group.length >= 6) {
      const podMembers = group.splice(0, 6);
      const pod = await Pod.create({ members: podMembers.map(u => u._id), skill: podMembers[0].skills[0] });
      for (const member of podMembers) {
        member.podId = pod._id;
        await member.save();
      }
    }
  }
}
