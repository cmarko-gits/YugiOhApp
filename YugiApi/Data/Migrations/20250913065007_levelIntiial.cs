using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YugiApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class levelIntiial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Cards",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "Cards");
        }
    }
}
