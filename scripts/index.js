var canDiv = document.getElementById("canvas");
var ctx = canDiv.getContext("2d");
var timer;
var height = 800;
var width =  800;
var gravity = 1;
var numberOfBirds = 16;
const pixelLength = 2;
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
	this.gridWidth = Math.ceil(width / pixelLength);
	this.gridHeight = Math.ceil(height / pixelLength);
	this.grid = new Array(this.gridWidth);

	for(var i = 0; i < this.gridWidth; i++)
	{
		this.grid[i] = new Array(this.gridHeight);
		for(var j = 0; j < this.gridHeight; j++)
		{
			this.grid[i][j] = new Block(i * pixelLength, j * pixelLength, Math.floor(Math.random() * 3) + 1);
		}
	}

	/*for(var i = 10; i < 20; i++)
	{
		for(var j = 10; j < 20; j++)
		{
			this.grid[i][j].type = 3;
		}
	}*/

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
		var newGrid = new Array(this.gridWidth);

		for(var i = 0; i < this.gridWidth; i++)
		{
			newGrid[i] = new Array(this.gridHeight);
			for(var j = 0; j < this.gridHeight; j++)
			{
				newGrid[i][j] = new Block(i * pixelLength, j * pixelLength, 0);
			}
		}

		for(var i = 0; i < newGrid.length; i++)
		{
			var maxArr = 1;
			for(var j = 0; j < newGrid[i].length; j++)
			{
				counters = [0, 0, 0];

				counters = this.grid[i][j].fight(this.grid, i - 1, j - 1, counters);
				counters = this.grid[i][j].fight(this.grid, i - 1, j, counters);
				counters = this.grid[i][j].fight(this.grid, i - 1, j + 1, counters);
				counters = this.grid[i][j].fight(this.grid, i, j - 1, counters);
				counters = this.grid[i][j].fight(this.grid, i, j + 1, counters);
				counters = this.grid[i][j].fight(this.grid, i + 1, j - 1, counters);
				counters = this.grid[i][j].fight(this.grid, i + 1, j, counters);
				//counters = this.grid[i][j].fight(this.grid, i + 1, j + 1, counters);

				maxArr = Math.max.apply(Math, counters);
				var newType = counters.indexOf(maxArr);
				newGrid[i][j].type = newType + 1;

				if(counters[0] == counters[1] && counters[0] == maxArr)
				{
					newGrid[i][j].type = Math.floor(Math.random() * 2) + 1;
				}
				else if(counters[1] == counters[2] && counters[1] == maxArr)
				{
					newGrid[i][j].type = Math.floor(Math.random() * 2) + 2;
				}
				else if(counters[0] == counters[2] && counters[0] == maxArr)
				{
					newNum = [1, 3];
					newGrid[i][j].type = newNum[Math.floor(Math.random() * 2)];
				}
				else
				{
				}
			}
		}

		for(var i = 0; i < this.gridWidth; i++)
		{
			for(var j = 0; j < this.gridHeight; j++)
			{
				this.grid[i][j] = newGrid[i][j].copy();
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
			ctx.fillStyle = "#CB3590";
		}
		else if(this.type == 2)
		{
			ctx.fillStyle = "#8423BB";
		}
		else if(this.type == 3)
		{
			ctx.fillStyle = "#0038A8";
		}

		ctx.fillRect(this.x, this.y, this.length, this.length);
		//ctx.strokeRect(this.x, this.y, this.length, this.length);
	}

	Block.prototype.fight = function(grid, x, y, changeTo)
	{
		if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length)
		{
			return changeTo;
		}

		var other_block = grid[x][y];
		if(other_block.type == 0 && this.type == 0)
		{
			return changeTo;
		}

		if(other_block.type == 0 ||
			(this.type == 1 && other_block.type == 2) ||
			(this.type == 2 && other_block.type == 3) ||
			(this.type == 3 && other_block.type == 1))
		{
			changeTo[this.type - 1] += 1;
			return changeTo;
		}

		changeTo[other_block.type - 1] += 1;
		return changeTo;
	}

	Block.prototype.copy = function()
	{
		return new Block(this.x, this.y, this.type);
	}
}

setInterval(draw, 100);
