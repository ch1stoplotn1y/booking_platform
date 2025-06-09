export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("host_reviews", "userId", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("host_reviews", "userId");
    },
};
