module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksFilter("currency", (n) => {
    try { return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }); }
    catch { return n; }
  });
  return {
    dir: { input: "src", includes: "_includes", layouts: "_includes/layouts", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk","md","html"]
  };
};
