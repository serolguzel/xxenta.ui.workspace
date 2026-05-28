export abstract class GenesisId {

    public static NewGenesisId(): string {
        let date = new Date();
        let year = date.getFullYear();
        var id = GenesisId.GenerateUID(5);
        var genId = `${year}${id}`;
        return genId;
    }

    public static NewGenesisIdWithSize(size: number): string {
        let date = new Date();
        let year = date.getFullYear();
        var id = GenesisId.GenerateUID(size);
        var genId = `${year}${id}`;
        return genId;
    }

    public static GenerateUID(length: number): string {
        let result = '';
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

}