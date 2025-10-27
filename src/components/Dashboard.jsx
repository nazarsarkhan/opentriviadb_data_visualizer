import CategoryBarChart from "./charts/barChart.jsx";
import DifficultyPieChart from "./charts/pieChart.jsx";

function Dashboard({ byCategory, byDifficulty, selectedCategory, onSelectCategory }) {
  return (
    <section className="grid">
      <CategoryBarChart
        data={byCategory}
        onSelectCategory={onSelectCategory}
        ariaLabel="Distribution of questions by category"
      />
      <DifficultyPieChart
        data={byDifficulty}
        selectedCategory={selectedCategory}
        ariaLabel="Distribution of questions by difficulty"
      />
    </section>
  );
}

export default (Dashboard);
