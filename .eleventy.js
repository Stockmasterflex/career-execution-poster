module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });
  eleventyConfig.setBrowserSyncConfig({ open: false });

  // Time utility filters for calendar
  eleventyConfig.addFilter("timeToMin", (t) => {
    // "HH:MM" -> minutes since 00:00
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  });
  
  eleventyConfig.addFilter("pxFromMin", (min, startHour, pxPerHour) => {
    return ((min - startHour * 60) / 60) * pxPerHour;
  });
  
  eleventyConfig.addFilter("durationPx", (start, end, pxPerHour) => {
    return ((end - start) / 60) * pxPerHour;
  });

  // Add range function for Nunjucks
  eleventyConfig.addFilter("range", (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  });

  // Time utility filters for AM/PM formatting
  eleventyConfig.addFilter("time12", (str) => {
    // Accepts "HH:mm" or "H:mm" and returns "h:mm AM/PM"
    if (!str) return "";
    const [H, M] = str.split(":").map(Number);
    const ampm = H >= 12 ? "PM" : "AM";
    const h = ((H + 11) % 12) + 1;
    const mm = (M ?? 0).toString().padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  });

  eleventyConfig.addFilter("timerange12", (range) => {
    // Accepts "HH:mm–HH:mm" or "HH:mm - HH:mm"
    if (!range) return "";
    const parts = range.replace(" - ", "–").split("–");
    return `${eleventyConfig.getFilter("time12")(parts[0])} – ${eleventyConfig.getFilter("time12")(parts[1])}`;
  });

  // URL search parameter filter
  eleventyConfig.addFilter("urlSearchParam", (url, param) => {
    if (!url || !param) return null;
    try {
      const urlObj = new URL(url, 'http://localhost');
      return urlObj.searchParams.get(param);
    } catch (e) {
      return null;
    }
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};