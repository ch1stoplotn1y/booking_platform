export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("host_reviews", "hostId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        await queryInterface.sequelize.query(`
      UPDATE host_reviews
      SET "hostId" = bookings."userId"
      FROM bookings
      WHERE host_reviews."bookingId" = bookings."id"
    `);

        await queryInterface.changeColumn("host_reviews", "hostId", {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("host_reviews", "hostId");
    },
};
