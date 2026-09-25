/**
 * TwinMessageEngine - Contextual Twin Dialogue & Motivational Notes Engine
 * Derived strictly from real student learning metrics.
 */

export function getTwinMessage(user, dashboardData) {
  const name = user?.name ? user.name.split(' ')[0] : 'Student';
  const overallProgress = dashboardData?.overallProgress || 0;
  const weakTopicsCount = dashboardData?.weakTopics?.length || 0;
  const highRiskCount = dashboardData?.highRiskTopics?.length || 0;
  const streak = dashboardData?.currentStreak || 0;
  const recommendedTopic = dashboardData?.recommendedNextActivity?.topicName;

  if (highRiskCount > 0) {
    return {
      dialogue: `Hi ${name} 👋 I noticed ${highRiskCount} topic(s) have an increasing forgetting risk. Let me guide your revision session!`,
      highlight: recommendedTopic ? `Let's revise ${recommendedTopic} first.` : 'A short 20-minute revision will lock in your memory curve.',
      type: 'warning'
    };
  }

  if (weakTopicsCount > 0) {
    return {
      dialogue: `Hi ${name} 👋 We have ${weakTopicsCount} target area(s) below 50% mastery. I've scheduled a quick fix for you!`,
      highlight: recommendedTopic ? `Recommended: ${recommendedTopic}` : 'Targeting weak topics yields the biggest score gains.',
      type: 'attention'
    };
  }

  if (streak >= 3) {
    return {
      dialogue: `Hi ${name} 👋 Outstanding momentum! You've logged a ${streak}-day active study streak.`,
      highlight: `Overall mastery is currently at ${overallProgress}%. Keep going!`,
      type: 'success'
    };
  }

  return {
    dialogue: `Hi ${name} 👋 I've been continuously analyzing how you learn. Ready for today's session?`,
    highlight: recommendedTopic ? `Next Up: ${recommendedTopic}` : `Overall mastery is at ${overallProgress}%.`,
    type: 'neutral'
  };
}

export function getTwinMotivationalNote(dashboardData) {
  const highRiskCount = dashboardData?.highRiskTopics?.length || 0;
  const weakTopicsCount = dashboardData?.weakTopics?.length || 0;
  const overallProgress = dashboardData?.overallProgress || 0;

  if (highRiskCount > 0) {
    return {
      quote: "If you've forgotten something, that's completely okay. Let me help you bring it back today.",
      author: "A NOTE FROM YOUR TWIN"
    };
  }

  if (weakTopicsCount > 0) {
    return {
      quote: "You don't have to master everything today. Just focus on improving one single concept.",
      author: "A NOTE FROM YOUR TWIN"
    };
  }

  if (overallProgress > 70) {
    return {
      quote: "Your future self will thank you for the disciplined effort you put in today.",
      author: "A NOTE FROM YOUR TWIN"
    };
  }

  return {
    quote: "One focused 25-minute study session can completely change the direction of your week.",
    author: "A NOTE FROM YOUR TWIN"
  };
}
