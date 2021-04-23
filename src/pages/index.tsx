import { GetStaticProps } from 'next' // tipagem
import Image from 'next/image'
import { format, lastDayOfDecade, parseISO } from 'date-fns' // parseISO > converte para um date do JS
import { api } from '../services/api'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import { Helmet } from 'react-helmet'
import Link from 'next/link'
import { usePlayer } from '../contexts/PlayerContext'
import Head from 'next/head'

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
  thumbnail: string;
}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])
  
  const { playList } = usePlayer()
  const  episodeList = [...latestEpisodes, ...allEpisodes]
  
  return (
    <>
      <div className={styles.homepage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>
      
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit='cover'
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button' onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>PodCast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return(
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit='cover'
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type='button' onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}              
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // buscar um dado -> get
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published',
      _order: 'desc'
    }
  })

  const episodes = data.map(episodes => {
    return {
      id: episodes.id,
      title: episodes.title,
      thumbnail: episodes.thumbnail,
      members: episodes.members,
      publishedAt: format(parseISO(episodes.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episodes.file.duration), 
      durationAsString: convertDurationToTimeString(Number(episodes.file.duration)),
      url: episodes.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8, // gera uma nova verção da pagina a cada 8H
  }
}
