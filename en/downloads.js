const regions = [...document.querySelectorAll(".market")];
const picker = document.querySelector("#region");
const defaultRegion = picker.querySelector('option[value=""]') ? "" : "US";

for (const region of regions) {
  picker.add(new Option(region.querySelector("h3").textContent, region.id));
}
picker.add(new Option(picker.dataset.otherLabel || "My region isn’t listed", "other"));

function showRegion(id) {
  const selected = regions.find(region => region.id === id);
  const awaitingChoice = id === "" && defaultRegion === "";
  picker.value = selected ? selected.id : awaitingChoice ? "" : "other";
  for (const region of regions) region.hidden = region !== selected;
  document.querySelector(".no-store").hidden = Boolean(selected) || awaitingChoice;
  document.querySelector(".checkout").hidden = !selected;
}

picker.addEventListener("change", () => {
  showRegion(picker.value);
  history.replaceState(null, "", location.pathname + location.search + "#" + (picker.value || "download"));
});
window.addEventListener("hashchange", () => {
  if (location.hash !== "#download") showRegion(location.hash.slice(1).toUpperCase() || defaultRegion);
});
const entry = location.hash.slice(1).toUpperCase();
showRegion(entry && entry !== "DOWNLOAD" ? entry : defaultRegion);
document.querySelector(".picker-control").hidden = false;
document.querySelector(".market-list").classList.add("filtered");
