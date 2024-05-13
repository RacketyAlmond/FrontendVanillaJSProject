const pageTitle = "JS SPA Routing"

const routes = {
  404: "404.html",
  "/": "index.html",
  section: "empty.html",
  top: "empty.html",
  write: "write/write.html",
  workshop: "workshop/workshop.html",
  forum: "forum/forum.html",
  howWrite: "how_to_write/how_to_write.html"

}

const locationHandler = async () => {
  const location = window.location.hash.replace("#", "");
  if(location.length === 0){
  }
  const route = routes[location];
  const html = await fetch(route).then((response) => response.text());
  document.getElementById("content").innerHTML = html;
  document.title = route.title;
  document
    .querySelector(`meta[name="description"]`)
    .setAttribute("content", route.description);
}

window.addEventListener("hashchange", locationHandler);
locationHandler();