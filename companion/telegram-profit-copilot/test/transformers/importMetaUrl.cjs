const ts = require("typescript");

module.exports = {
  name: "import-meta-url",
  version: 1,
  factory() {
    return (context) => {
      const visit = (node) => {
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isMetaProperty(node.expression) &&
          node.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
          node.expression.name.text === "meta" &&
          node.name.text === "url"
        ) {
          return ts.factory.createStringLiteral("file://__jest_import_meta_url__");
        }

        return ts.visitEachChild(node, visit, context);
      };

      return (sourceFile) => ts.visitNode(sourceFile, visit);
    };
  },
};
