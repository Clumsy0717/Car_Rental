Put your car photos in this folder, named after the car (lowercase, dashes):

  gt-r.webp        (Nissan GT-R)
  mustang.jpg     (Ford Mustang)
  fortuner.jpg    (Toyota Fortuner)
  civic.jpg       (Honda Civic)
  vios.jpg        (Toyota Vios)
  montero.jpg     (Mitsubishi Montero)

Accepted types: .png .jpg .jpeg .webp

The page removes the background automatically in the browser and remembers the
result, so each photo is only processed once.

Already have a transparent PNG? Name it  <name>-nobg.png  (e.g. gt-r-nobg.png)
and it will be used as-is, with no processing.

Best results: a side view of the car, one car per photo, good lighting.

Note: open the site through a local server (for example VS Code "Live Server"
or  `python -m http.server`  in the project folder) so the browser can read the
images. Double-clicking index.html (file://) will still show your photos, but
the automatic background removal needs a server.

To add a new car, add an entry to the `cars` array in script.js and use the same
naming rule for its photo.