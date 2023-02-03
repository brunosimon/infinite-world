class Game
{
    static register(path, name, value)
    {
        let parent = Game

        if(path)
        {
            const pathParts = path.split('.')
            for(const pathPart of pathParts)
            {
                if(!parent[pathPart])
                    parent[pathPart] = {}

                parent = parent[pathPart]
            }
        }

        parent[name] = value
    }
}

export default Game