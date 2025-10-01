import { useState, useEffect } from "react";
import "./App.css"; // Tailwind + custom animations if any

type Meal = {
  id: number;
  title: string;
  kcal: number;
  time: string;
  details: string;
  checked: boolean;
};

const TARGET_KCAL = 1200;

function MealItem({
  meal,
  onToggle,
  onDelete,
}: {
  meal: Meal;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${meal.title}"?`)) {
      onDelete(meal.id);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm">{meal.title}</p>
      <div className="flex justify-between items-center bg-white rounded-md p-3 shadow mt-1">
        <p className="text-sm text-gray-700">{meal.kcal} Kcal</p>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={meal.checked}
              onChange={() => onToggle(meal.id)}
              className="w-4 h-4"
            />
            {meal.checked && (
              <span className="text-sm select-none">Done😊</span>
            )}
          </label>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            aria-label={`Delete ${meal.title}`}
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {meal.time} | {meal.details}
      </p>
    </div>
  );
}

export default function App() {
  const initialMeals: Meal[] = [
    {
      id: 1,
      title: "Leamon water",
      kcal: 0,
      time: "6 AM",
      details: "P 0 . C 0 . F 0",
      checked: false,
    },
    {
      id: 2,
      title: "2 boiled eggs + 2 medium bananas + 5 almonds",
      kcal: 310,
      time: "7 AM",
      details: "P 17g . C 46g . F 7g",
      checked: false,
    },
    {
      id: 3,
      title:
        "1 cup cooked white rice (130g) + 1 cup dal (200g) + 1 medium boiled potato",
      kcal: 430,
      time: "2 PM",
      details: "P 28g . C 75g . F 1.5g",
      checked: false,
    },
    {
      id: 4,
      title:
        "1 cup cooked white rice (130g) + 1 cup dal (200g) + 2 boiled eggs",
      kcal: 460,
      time: "2 PM",
      details: "P 28g . C 75g . F 1.5g",
      checked: false,
    },
  ];

  // Load meals from localStorage or fallback to initialMeals
  const [meals, setMeals] = useState<Meal[]>(() => {
    const savedMeals = localStorage.getItem("meals");
    return savedMeals ? JSON.parse(savedMeals) : initialMeals;
  });

  const [quickAdd, setQuickAdd] = useState({
    title: "",
    kcal: "",
    protein: "",
    carbs: "",
    fat: "",
    mealTime: "7 AM", // default meal time
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning!!😊";
    if (hour < 18) return "Good afternoon!!😊";
    return "Good evening!!😊";
  };

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Update localStorage whenever meals change
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const handleToggle = (id: number) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, checked: !meal.checked } : meal
      )
    );
  };

  const handleDelete = (id: number) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const totalKcal = meals
    .filter((meal) => meal.checked)
    .reduce((sum, meal) => sum + meal.kcal, 0);

  const neededKcal = TARGET_KCAL - totalKcal;

  const handleQuickAdd = () => {
    if (!quickAdd.title || !quickAdd.kcal) return;

    const newMeal: Meal = {
      id: Date.now(),
      title: quickAdd.title,
      kcal: parseInt(quickAdd.kcal),
      time: quickAdd.mealTime, // use selected meal time here
      details: `P ${quickAdd.protein || 0}g . C ${quickAdd.carbs || 0}g . F ${
        quickAdd.fat || 0
      }g`,
      checked: false,
    };

    setMeals((prev) => [...prev, newMeal]);

    setQuickAdd({
      title: "",
      kcal: "",
      protein: "",
      carbs: "",
      fat: "",
      mealTime: "7 AM",
    });
  };

  return (
    <div className="flex flex-col bg-rose-50 p-4 min-h-screen pb-20 transition-all duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold">Hi, Anjali Kumari Chaudhary</h1>
          <p className="text-sm text-gray-700">{getGreeting()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formattedDate}</p>
          <p className="text-xs text-gray-600">{formattedTime}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex mt-4 space-x-2">
        <button className="bg-yellow-300 px-3 py-1 rounded-full text-sm font-bold">
          CALORIE INTAKE
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-sm font-bold">
          CALORIE BURNED
        </button>
      </div>

      {/* Target */}
      <p className="mt-4 font-bold">Target = {TARGET_KCAL} Kcal</p>

      {/* Meals */}
      {meals.map((meal) => (
        <MealItem
          key={meal.id}
          meal={meal}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}

      {/* Total Section */}
      <div className="mt-4">
        <p className="font-bold text-green-700 transition-all duration-500">
          Total = {totalKcal} Kcal
        </p>
        {neededKcal > 0 ? (
          <p
            key={neededKcal}
            className="font-bold text-rose-700 animate-bounce"
          >
            🚨 Need = {TARGET_KCAL} - {totalKcal} = {neededKcal} Kcal more!
          </p>
        ) : (
          <p className="text-green-600 font-bold animate-pulse" key="no-need">
            🎉 Target Reached!
          </p>
        )}
      </div>

      {/* Quick Add */}
      <div className="mt-6 bg-white p-3 rounded-md shadow">
        <p className="font-semibold text-sm mb-2">Quick add</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Food"
            className="border rounded px-2 py-1 text-xs"
            value={quickAdd.title}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <input
            placeholder="Calories"
            className="border rounded px-2 py-1 text-xs"
            type="number"
            value={quickAdd.kcal}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, kcal: e.target.value }))
            }
          />
          <input
            placeholder="Protein (g)"
            className="border rounded px-2 py-1 text-xs"
            type="number"
            value={quickAdd.protein}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, protein: e.target.value }))
            }
          />
          <input
            placeholder="Carbs (g)"
            className="border rounded px-2 py-1 text-xs"
            type="number"
            value={quickAdd.carbs}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, carbs: e.target.value }))
            }
          />
          <input
            placeholder="Fat (g)"
            className="border rounded px-2 py-1 text-xs"
            type="number"
            value={quickAdd.fat}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, fat: e.target.value }))
            }
          />
          {/* Meal Time Selector */}
          <select
            className="border rounded px-2 py-1 text-xs col-span-2"
            value={quickAdd.mealTime}
            onChange={(e) =>
              setQuickAdd((prev) => ({ ...prev, mealTime: e.target.value }))
            }
          >
            <option>12 AM</option>
            <option>1 AM</option>
            <option>2 AM</option>
            <option>3 AM</option>
            <option>4 AM</option>
            <option>5 AM</option>
            <option>6 AM</option>
            <option>7 AM</option>
            <option>8 AM</option>
            <option>9 AM</option>
            <option>10 AM</option>
            <option>11 AM</option>
            <option>12 PM</option>
            <option>1 PM</option>
            <option>2 PM</option>
            <option>3 PM</option>
            <option>4 PM</option>
            <option>5 PM</option>
            <option>6 PM</option>
            <option>7 PM</option>
            <option>8 PM</option>
            <option>9 PM</option>
            <option>10 PM</option>
            <option>11 PM</option>
          </select>
        </div>
        <button
          className="mt-2 bg-blue-500 px-3 py-1 rounded text-white text-sm"
          onClick={handleQuickAdd}
        >
          + Add
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow flex justify-around py-2">
        <span className="text-blue-600 font-semibold">Home</span>
        <span className="text-gray-600">Summary</span>
        <span className="text-gray-600">History</span>
        <span className="text-gray-600">Insights</span>
        <span className="text-gray-600">Settings</span>
      </div>
    </div>
  );
}
