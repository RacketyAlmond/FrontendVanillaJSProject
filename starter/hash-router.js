const pageTitle = "JS SPA Routing"

const routes = {
  404: "404.html",
  "/": "index.html",
  section_1: "empty.html",
  top: "empty.html",
  write: "write/write.html",
  workshop: "workshop.html",
  forum: "forum/forum.html",
  howWrite: "how_to_write/how_to_write.html"

}

const locationHandler = async () => {
  const location = window.location.hash.replace("#", "");

  if (location.length === 0) {
    // Handle the case where no location is specified
    return;
  }

  const route = routes[location];

  if (!route) {
    // Handle the case where the route is undefined
    console.error(`Route not found for location: ${location}`);
    return;
  }

  const html = await fetch(route).then((response) => response.text());
  document.getElementById("content").innerHTML = html;
  document.title = route.title;
  document
    .querySelector(`meta[name="description"]`)
    .setAttribute("content", route.description);
}

window.addEventListener("hashchange", locationHandler);
locationHandler();