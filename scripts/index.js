var canDiv = document.getElementById("canvas");
var ctx = canDiv.getContext("2d");
var timer;
var height = 800;
var width =  800;
var gravity = 1;
var numberOfBirds = 16;
canDiv.height = height;
canDiv.width = width;
canDiv.focus();

var grid = new RPSGrid();

function draw()
{
	grid.draw();
	update();
}

function update()
{
	grid.update();
}

function clickReporter(event)
{

}

function RPSGrid()
{
	this.gridWidth = 80;
	this.gridHeight = 80;
	this.grid = new Array(this.gridWidth);

	for(var i = 0; i < this.gridWidth; i++)
	{
		this.grid[i] = new Array(this.gridHeight);
		for(var j = 0; j < this.gridHeight; j++)
		{
			this.grid[i][j] = new Block(i * 10, j * 10, 0);
		}
	}

	this.grid[10][10]= new Block(100, 100, 1);
	this.grid[20][20].type = 2;
	this.grid[30][30].type = 3;

	RPSGrid.prototype.draw = function()
	{
		for(var i = 0; i < this.grid.length; i++)
		{
			for(var j = 0; j < this.grid[i].length; j++)
			{
				this.grid[i][j].draw();
			}
		}
	}

	RPSGrid.prototype.update = function()
	{
		for(var i = 0; i < this.grid.length; i++)
		{
			for(var j = 0; j < this.grid[i].length; j++)
			{
				counters = [0, 0, [0, 0, 0]];

				counters = this.grid[i][j].fight(this.grid, i - 1, j - 1, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i - 1, j, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i - 1, j + 1, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i, j - 1, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i, j + 1, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i + 1, j - 1, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i + 1, j, counters[0], counters[1], counters[2]);
				counters = this.grid[i][j].fight(this.grid, i + 1, j + 1, counters[0], counters[1], counters[2]);
				if(i == 10 && j == 10)
				{
					console.log(counters);
				}
				if(counters[0] * 2 > counters[1])
				{
					this.grid[i][j].type = Math.max(counters[2]) + 1;
				}

			}
		}
	}
}

function Block(x, y, type)
{
	/*
		Blue - Rock
		Red - Paper
		Yellow - Scissors
	*/
	this.x = x;
	this.y = y;
	this.length = 10;
	this.type = type;

	Block.prototype.draw = function()
	{
		if(this.type == 0)
		{
			ctx.fillStyle = "gray";
		}
		else if(this.type == 1)
		{
			ctx.fillStyle = "blue";
		}
		else if(this.type == 2)
		{
			ctx.fillStyle = "red";
		}
		else if(this.type == 3)
		{
			ctx.fillStyle = "yellow";
		}
		ctx.fillRect(this.x + 1, this.y + 1, this.length - 2, this.length - 2);
		ctx.strokeRect(this.x, this.y, this.length, this.length);
	}

	Block.prototype.fight = function(grid, x, y, win_counter, fight_counter, changeTo)
	{
		if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length)
		{
			return [win_counter, fight_counter, changeTo];
		}

		var other_block = grid[x][y];
		if(other_block.type == 0 && this.type == 0)
		{
			return [win_counter, fight_counter, changeTo];
		}

		fight_counter += 1;
		if(other_block.type == 0)
		{
			win_counter += 1;
			return [win_counter, fight_counter, changeTo];
		}
		if(other_block.type - this.type == 1 || this.type - other_block.type == 2)
		{
			win_counter += 1;
			return [win_counter, fight_counter, changeTo];
		}

		changeTo[other_block.type - 1] += 1;
		return [win_counter, fight_counter, changeTo];
	}
}

setInterval(draw, 30);
