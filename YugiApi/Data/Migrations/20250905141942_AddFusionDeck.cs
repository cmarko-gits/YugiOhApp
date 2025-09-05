using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YugiApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFusionDeck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeckId1",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cards_DeckId1",
                table: "Cards",
                column: "DeckId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Decks_DeckId1",
                table: "Cards",
                column: "DeckId1",
                principalTable: "Decks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Decks_DeckId1",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_DeckId1",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "DeckId1",
                table: "Cards");
        }
    }
}
