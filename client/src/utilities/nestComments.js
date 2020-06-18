const nestComments = (comments) => {
  const commentMap = {};

  // Create comment map with the structure of id as key and comment as value.
  comments.forEach((comment) => (commentMap[comment.id] = comment));

  // Iterate over the comments again and correctly nest the children.
  comments.forEach((comment) => {
    if (comment.parent_id !== null) {
      const parent = commentMap[comment.parent_id];
      (parent.children = parent.children || []).push(comment);
    }
  });

  // Filter the list to return a list of correctly nested comments.
  return comments.filter((comment) => {
    return comment.parent_id === null;
  });
};

export default nestComments;
