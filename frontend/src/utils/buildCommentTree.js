// Converts a flat array of comments (each with parentComment) into a nested tree.
export const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach((comment) => {
    map[comment._id] = { ...comment, children: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentComment) {
      map[comment.parentComment]?.children.push(map[comment._id]);
    } else {
      roots.push(map[comment._id]);
    }
  });

  return roots;
};