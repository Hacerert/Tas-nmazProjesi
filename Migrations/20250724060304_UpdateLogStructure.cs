using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tasinmazBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLogStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "Logs");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Logs");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Logs",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "ActionType",
                table: "Logs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Logs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "Logs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActionType",
                table: "Logs");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Logs");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "Logs");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Logs",
                newName: "Message");

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Logs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Logs",
                type: "text",
                nullable: true);
        }
    }
}
