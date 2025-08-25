using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YugiApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class DeckInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Decks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Decks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Decks_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DeckBanished",
                columns: table => new
                {
                    BanishedId = table.Column<int>(type: "INTEGER", nullable: false),
                    Deck2Id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckBanished", x => new { x.BanishedId, x.Deck2Id });
                    table.ForeignKey(
                        name: "FK_DeckBanished_Cards_BanishedId",
                        column: x => x.BanishedId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeckBanished_Decks_Deck2Id",
                        column: x => x.Deck2Id,
                        principalTable: "Decks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeckCards",
                columns: table => new
                {
                    CardsId = table.Column<int>(type: "INTEGER", nullable: false),
                    DeckId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckCards", x => new { x.CardsId, x.DeckId });
                    table.ForeignKey(
                        name: "FK_DeckCards_Cards_CardsId",
                        column: x => x.CardsId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeckCards_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeckGraveyard",
                columns: table => new
                {
                    Deck1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    GraveyardId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckGraveyard", x => new { x.Deck1Id, x.GraveyardId });
                    table.ForeignKey(
                        name: "FK_DeckGraveyard_Cards_GraveyardId",
                        column: x => x.GraveyardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeckGraveyard_Decks_Deck1Id",
                        column: x => x.Deck1Id,
                        principalTable: "Decks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeckBanished_Deck2Id",
                table: "DeckBanished",
                column: "Deck2Id");

            migrationBuilder.CreateIndex(
                name: "IX_DeckCards_DeckId",
                table: "DeckCards",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckGraveyard_GraveyardId",
                table: "DeckGraveyard",
                column: "GraveyardId");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_UserId",
                table: "Decks",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeckBanished");

            migrationBuilder.DropTable(
                name: "DeckCards");

            migrationBuilder.DropTable(
                name: "DeckGraveyard");

            migrationBuilder.DropTable(
                name: "Decks");
        }
    }
}
