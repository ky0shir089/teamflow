export function getAvatar(userPicture: string | null, userEmail: string) {
  return userPicture
    ? userPicture
    : `https://avatar.vercel.sh/${userEmail}.svg`;
}
