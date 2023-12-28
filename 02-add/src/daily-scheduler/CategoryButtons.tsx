import CategoryButton from "./CategoryButton";
import type { ScheduleCategoryButton } from "./CategoryButton";

export default function CategoryButtons({
  items,
  updateActiveCategory,
}: {
  items: ScheduleCategoryButton[];
  updateActiveCategory(entry: ScheduleCategory): void;
}) {
  return (
    <div className="category-buttons">
      {items.map((i) => (
        <CategoryButton
          key={i.id}
          {...i}
          updateActiveCategory={updateActiveCategory}
        />
      ))}
    </div>
  );
}
