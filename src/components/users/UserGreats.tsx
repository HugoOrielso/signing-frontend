"use client";

export function Greeting() {
  const hour = new Date().getHours();

  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Buenos días";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  return (
    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
      {greeting} 👋
    </h1>
  );
}