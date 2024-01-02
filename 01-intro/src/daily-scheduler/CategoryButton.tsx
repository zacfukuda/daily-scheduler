export interface ScheduleCategoryButton extends ScheduleCategory {
  active?: boolean;
}

interface CategoryButtonProps extends ScheduleCategoryButton {
  updateActiveCategory(entry: ScheduleCategory): void;
}

export default function CategoryButton({
  id,
  name,
  fill,
  stroke,
  active,
  updateActiveCategory,
}: CategoryButtonProps) {
  function handleClick(): void {
    updateActiveCategory({ id, name, fill, stroke });
  }

  return (
    <button
      className={"category-button" + (active ? " on" : "")}
      type="button"
      onClick={handleClick}
    >
      <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16">
        <rect x="0" y="0" width="16" height="16" fill={fill} stroke={stroke} />
      </svg>
      &ensp;{name}
    </button>
  );
}
