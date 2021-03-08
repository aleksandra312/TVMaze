/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	const getShowsByNameUrl = `http://api.tvmaze.com/search/shows?q=${query}`;
	let res = '';
	try {
		res = await axios.get(getShowsByNameUrl);
	} catch (error) {
		console.log(`Get Shows API returned an error: ${error}`);
		alert('No shows found for given search query.');
	}
	return returnShowsList(res.data);
}

const returnShowsList = (respData) => {
	const showsList = [];
	for (let item of respData) {
		let image = '';
		if (item.show.image) image = item.show.image.original;
		showsList.push({
			id: item.show.id,
			name: item.show.name,
			summary: item.show.summary,
			image
		});
	}
	return showsList;
};

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src='${show.image}'>
           </div>
           <button id ="btn-episodes" class="btn btn-primary" type="submit">Episodes</button>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

$('#shows-list').on('click', '#btn-episodes', async function handleEpisodes(evt) {
	let id = $(this).parent().attr('data-show-id');

	let episodes = await getEpisodes(id);

	populateEpisodes(episodes);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	const getEpisodesUrl = `http://api.tvmaze.com/shows/${id}/episodes`;
	let res = '';
	try {
		res = await axios.get(getEpisodesUrl);
	} catch (error) {
		console.log(`Get Episodes API returned an error: ${error}`);
		alert('This show does not have any episiodes.');
	}
	return returnEpisodesList(res.data);
}

const returnEpisodesList = (respData) => {
	const episodesList = [];
	for (let item of respData) {
		episodesList.push({
			id: item.id,
			name: item.name,
			season: item.season,
			number: item.number
		});
	}
	console.log(episodesList);
	return episodesList;
};

function populateEpisodes(episodes) {
	$('#episodes-area').show();

	const $episodesList = $('#episodes-list');
	$episodesList.empty();

	for (let episode of episodes) {
		let LItext = `${episode.name} (season ${episode.season}, number ${episode.number})`;
		let $LI = $(`<li data-episode-id="${episode.id}">${LItext}</li>`);
		$episodesList.append($LI);
	}
}
