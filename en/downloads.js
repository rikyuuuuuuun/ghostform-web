const regions = [...document.querySelectorAll(".market")];
const picker = document.querySelector("#region");

for (const region of regions) {
  picker.add(new Option(region.querySelector("h3").textContent, region.id));
}
picker.add(new Option("My region isn’t listed", "other"));

function showRegion(id) {
  const selected = regions.find(region => region.id === id);
  picker.value = selected ? selected.id : "other";
  for (const region of regions) region.hidden = region !== selected;
  document.querySelector(".no-store").hidden = Boolean(selected);
  document.querySelector(".checkout").hidden = !selected;
}

picker.addEventListener("change", () => {
  showRegion(picker.value);
  history.replaceState(null, "", location.pathname + location.search + "#" + picker.value);
});
window.addEventListener("hashchange", () => {
  if (location.hash !== "#download") showRegion(location.hash.slice(1).toUpperCase() || "US");
});
const entry = location.hash.slice(1).toUpperCase();
showRegion(entry && entry !== "DOWNLOAD" ? entry : "US");
document.querySelector(".picker-control").hidden = false;
document.querySelector(".market-list").classList.add("filtered");
