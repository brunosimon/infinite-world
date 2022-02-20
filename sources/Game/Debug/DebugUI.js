import * as dat from 'lil-gui'

export default class DebugUI
{
    constructor()
    {
        this.instance = new dat.GUI({ width: 320, title: 'debug' })

        const sheet = window.document.styleSheets[0]
        sheet.insertRule(`
            .lil-gui .lil-gui > .children
            {
                border: none;
                margin-left: var(--folder-indent);
                border-left: 2px solid var(--widget-color);
            }
        `, sheet.cssRules.length)
        sheet.insertRule(`
            .lil-gui.root > .children > .lil-gui > .title
            {
                border-width: 1px 0 0 0;
            }
        `, sheet.cssRules.length)

        this.tree = {}
        this.tree.folder = this.instance
        this.tree.children = {}
    }

    getFolder(path)
    {
        const parts = path.split('/')

        let branch = this.tree

        for(const part of parts)
        {
            let newBranch = branch.children[part]

            if(!newBranch)
            {
                newBranch = {}
                newBranch.folder = branch.folder.addFolder(part)
                newBranch.folder.close()
                newBranch.children = {}
            }

            branch.children[part] = newBranch
            branch = newBranch
        }

        return branch.folder
    }
}