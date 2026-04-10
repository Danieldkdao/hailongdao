import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  name: string;
  image: string | null | undefined;
  className?: string;
  textClassName?: string;
};

export const UserAvatar = ({
  name,
  image,
  className,
  textClassName,
}: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={image ?? undefined} alt={name} />
      <AvatarFallback className={textClassName}>
        {name
          .split(" ")
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};
