
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
ownerId: faker.lorem.sentence(1),
name: faker.datatype.number(""),
address: faker.datatype.number(""),
contactNumber: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
