/**
 * Check if a tool has reached a milestone
 * @param prevStars - The number of stars the tool had before the current update
 * @param newStars - The current number of stars for the tool
 * @returns The milestone reached, or null if it hasn't reached any milestone
 */
export const getMilestoneReached = (prevStars: number, newStars: number) => {
  const baseMilestones = [100, 500, 1000, 2500, 5000]
  const tenThousands = Array.from({ length: 30 }, (_, i) => (i + 1) * 10000)
  const twentyFiveThousands = Array.from({ length: 12 }, (_, i) => (i + 1) * 25000)
  const milestones = [...new Set([...baseMilestones, ...tenThousands, ...twentyFiveThousands])]

  const unreachedMilestones = milestones.sort((a, b) => a - b).filter(m => prevStars < m)
  const reachedMilestones = unreachedMilestones.filter(m => newStars >= m)

  return reachedMilestones.length ? Math.max(...reachedMilestones) : null
}
