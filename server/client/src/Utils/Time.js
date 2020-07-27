import moment from "moment";

export const timeAgo = (mainDate) => {
  var createdAt =
    Math.round(
      moment
        .duration(moment(mainDate, "YYYY-MM-DDTHH:mm:ss.sssZ").diff(moment()))
        .asSeconds()
    ) * -1;
  if (createdAt > 31104000) {
    return `${Math.round(createdAt / 31104000)} years ago`;
  } else if (createdAt > 2592000) {
    return `${Math.round(createdAt / 2592000)} months ago`;
  } else if (createdAt > 604800) {
    return `${Math.round(createdAt / 604800)} weeks ago`;
  } else if (createdAt > 86400) {
    return `${Math.round(createdAt / 86400)} days ago`;
  } else if (createdAt > 3600) {
    return `${Math.round(createdAt / 3600)} hours ago`;
  } else if (createdAt > 60) {
    return `${Math.round(createdAt / 60)} minutes ago`;
  }
  return `${Math.round(createdAt)} seconds ago`;
};
