import React, { useLayoutEffect } from 'react'
import { useLoggingInUser } from '../Provider/hooks'
import Breadcrumbs from '../components/Breadcrumbs'
import SubTitle from '../components/SubTitle'
import AnnotationHistoryTable from './AnnotationHistoryTable'
import AnnotationProgressCircle from './AnnotationProgressCircle'

export default function UserPage() {
  return (
    <UserPageContents />
  )
}

function UserPageContents() {
  const [userInfo, setLoggingInUserInfo] = useLoggingInUser() // ログイン中のユーザー情報

  // ログイン中のユーザー情報を設定
  useLayoutEffect(() => {
    setLoggingInUserInfo()
  }, [])

  return (
    <div className="user-page">
      <Breadcrumbs />
      <div className='flex'>
        <div>
          <SubTitle heading="ユーザーページ" />
          <div className="greeting">ようこそ {userInfo.user_name} さん</div>
        </div>

        { userInfo.user_name != 'guest' &&
          <>
            <div className="considerations">
              <h3>[アノテーション作業中の注意事項]</h3>
              <h4>※1　1つのCMでのアノテーション作業が終了した際には、Labels ALL Correct にチェックを入れてください</h4>
              <h4>※2　作業中に不具合が起きた場合は、リロードして該当のシーンから始めてください</h4>
            </div>
            <AnnotationProgressCircle userId={userInfo.user_id} />
          </>
        }
      </div>

      { userInfo.user_name != 'guest' &&
        <>
          <h3 className="table-title">アノテーション作業履歴</h3>
          <AnnotationHistoryTable userId={userInfo.user_id} />
        </>
      }
    </div>
  )
}
