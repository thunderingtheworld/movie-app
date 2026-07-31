export default function formatVoteCount(voteCount) {
  if (voteCount >= 1_000_000) {
    return `${(voteCount / 1_000_000).toFixed(1)}m`;
  }

  if (voteCount >= 1_000) {
    return `${(voteCount / 1_000).toFixed(1)}k`;
  }

  return voteCount.toLocaleString();
}
