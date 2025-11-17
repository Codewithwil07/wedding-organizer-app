String smartTrim(String text, {int max = 40}) {
  if (text.length <= max) return text;

  String cut = text.substring(0, max);
  int lastSpace = cut.lastIndexOf(" ");

  return cut.substring(0, lastSpace) + "...";
}
