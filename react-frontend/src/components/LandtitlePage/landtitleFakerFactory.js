
import { faker } from "@faker-js/faker";
export default (user,count,ownerIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
titleId: faker.datatype.number(""),
titleNumber: faker.datatype.number(""),
ownerId: ownerIdIds[i % ownerIdIds.length],
registeredDate: faker.datatype.number(""),
expireDate: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
