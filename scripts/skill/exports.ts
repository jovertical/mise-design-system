/** The names a component folder's index.ts re-exports, in source order. */
import ts from 'typescript'

export type ExportDoc = { name: string; from: string; component: boolean; typeOnly: boolean }

export function folderExports(indexSource: string): ExportDoc[] {
  const source = ts.createSourceFile('index.ts', indexSource, ts.ScriptTarget.Latest, true)
  return source.statements.flatMap((statement) => {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.moduleSpecifier ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      return []
    }
    const from = (statement.moduleSpecifier as ts.StringLiteral).text
    return statement.exportClause.elements.map((element) => ({
      name: element.name.text,
      from,
      component: element.propertyName?.text === 'default' && from.endsWith('.svelte'),
      typeOnly: statement.isTypeOnly || element.isTypeOnly,
    }))
  })
}
