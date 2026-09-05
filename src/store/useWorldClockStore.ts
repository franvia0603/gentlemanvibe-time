import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CITY_IDS } from "@/lib/worldCities";

interface WorldClockState {
  cityIds: string[];
  addCity: (id: string) => void;
  removeCity: (id: string) => void;
}

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set, get) => ({
      cityIds: DEFAULT_CITY_IDS,

      addCity: (id) => {
        const { cityIds } = get();
        if (cityIds.includes(id)) return;
        set({ cityIds: [...cityIds, id] });
      },

      removeCity: (id) => {
        set((state) => ({
          cityIds: state.cityIds.filter((cityId) => cityId !== id),
        }));
      },
    }),
    {
      name: "gv-world-clock-cities",
      // 서버 렌더/최초 클라이언트 렌더가 항상 기본값으로 일치하도록,
      // localStorage 복원은 마운트 후 수동으로 트리거한다 (hydration mismatch 방지).
      skipHydration: true,
    },
  ),
);
