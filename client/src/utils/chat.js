export function getRoomId(id1,id2){

    return [id1,id2]

        .sort((a,b)=>a-b)

        .join("_");

}