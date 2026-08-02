export default function formatVoteCount(voteCount) {
  if (voteCount >= 1_000_000) {
    return `${(voteCount / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  }

  if (voteCount >= 1_000) {
    return `${(voteCount / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return voteCount.toLocaleString();
}
