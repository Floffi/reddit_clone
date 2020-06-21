const nestComments = (comments) => {
  const commentMap = {};
  const commentsCopy = comments.map((comment) => Object.assign({}, comment));

  // Create comment map with the structure of id as key and comment as value.
  commentsCopy.forEach((comment) => (commentMap[comment.id] = comment));

  // Iterate over the comments again and correctly nest the children.
  commentsCopy.forEach((comment) => {
    if (comment.parent_id !== null) {
      const parent = commentMap[comment.parent_id];
      (parent.children = parent.children || []).push(comment);
    }
  });
  // Filter the list to return a list of correctly nested comments.
  return commentsCopy.filter((comment) => {
    return comment.parent_id === null;
  });
};

export default nestComments;
