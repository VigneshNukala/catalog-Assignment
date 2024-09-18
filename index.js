function decodeY(base, value) {
  return parseInt(value, base);
}

function processPoints(input) {
  const points = [];
  Object.entries(input).forEach(([key, { base, value }]) => {
    if (key !== 'keys') {
      const x = parseInt(key, 10);
      const y = decodeY(parseInt(base, 10), value);
      points.push({ x, y });
    }
  });
  return points;
}

function lagrangeInterpolation(points, x) {
  return points.reduce((result, point, i) => {
    let term = point.y;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        term *= (x - points[j].x) / (point.x - points[j].x);
      }
    }
    return result + term;
  }, 0);
}

async function fetchDataAndProcess(url) { 
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const { n, k } = data.keys;
    const points = processPoints(data);
    const secret = lagrangeInterpolation(points.slice(0, k), 0);
    console.log('The secret c is:', secret);
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

fetchDataAndProcess('./index.json');
fetchDataAndProcess('./testcase2.json');
