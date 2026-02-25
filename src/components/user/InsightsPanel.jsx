import React, { useEffect, useState } from "react";
import { PieChart, Lightbulb } from "lucide-react";
import { getAIInsights } from "../../api/api";

const InsightsPanel = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await getAIInsights();
        setTopCategories(data.topCategories);
        setTip(data.tip);
      } catch (err) {
        console.error("Insights load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500 text-lg animate-pulse">
        Loading AI insights...
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        AI Insights 💡
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Top Spending Categories */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h2 className="font-semibold text-xl text-gray-800">
              Top Spending Categories
            </h2>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-gray-500 italic">No data available</p>
          ) : (
            <ul className="space-y-3 text-gray-700 font-medium">
              {topCategories.map((c, i) => (
                <li key={i}>
                  {c.category} – ₹{c.total}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI Tip */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h2 className="font-semibold text-xl text-gray-800">AI Tip</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md text-gray-500 text-center italic">
        📊 More charts and insights coming soon…
      </div>
    </div>
  );
};

export default InsightsPanel;
