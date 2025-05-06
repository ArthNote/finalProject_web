import { getUnlockedRewards } from "@/lib/api/goals";
import { useQuery } from "@tanstack/react-query";

export const useUnlockedThemes = () => {
  const { data: unlockedThemes } = useQuery({
    queryKey: ["unlockedThemes"],
    queryFn: getUnlockedRewards,
  });

  const themes =
    unlockedThemes?.filter((reward) => reward.reward.type === "THEME") ?? [];

  return themes;
};
