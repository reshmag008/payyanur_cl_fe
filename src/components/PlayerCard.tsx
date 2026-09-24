import { useState } from 'react';
import { User, MapPin, Crosshair, Target, Pencil, Trash2,Phone } from 'lucide-react';
import { Player } from '@/types/player';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PlayerForm from './PlayerForm';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { deletePlayer } = usePlayer();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    deletePlayer(player.id);
    toast.success('Player deleted successfully!');
    setShowDeleteDialog(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-secondary text-secondary-foreground';
      case 'Bowler':
        return 'bg-primary text-primary-foreground';
      case 'All-Rounder':
        return 'bg-pitch-dark text-primary-foreground';
      case 'Wicket-Keeper':
      case 'Wicket-Keeper Batsman':
        return 'bg-gold-dark text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>


    {/* <div className="w-full max-w-sm mx-auto">
  <div className="
    relative overflow-hidden
    rounded-2xl
    bg-black
    border-2 border-yellow-600
    shadow-2xl
  ">

    <div className="absolute inset-1 rounded-xl border border-yellow-400/60 pointer-events-none z-20" />

    <div className="relative h-[390px] bg-gray-950 overflow-hidden">

      {player.profile_image ? (
        <img
          src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
          alt={player.fullname}
          className="
            absolute inset-0
            w-full h-full
            object-contain
          "
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <User className="w-24 h-24 text-gray-600" />
        </div>
      )}

      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black via-black/20 to-black/10
      " />

      <div className="
        absolute inset-3
        border-2 border-yellow-500/70
        pointer-events-none
      " />

      <div className="
        absolute top-5 right-5
        w-11 h-11
        rounded-full
        bg-black
        border-2 border-yellow-400
        flex items-center justify-center
        text-yellow-300
        text-sm font-bold
        shadow-lg
      ">
        {player.id}
      </div>

      <div className="
        absolute
        bottom-4
        left-4 right-4
        grid grid-cols-3
        gap-2
      ">

        <div className="
          bg-black/90
          border border-yellow-500
          rounded-lg
          px-2 py-2
          text-center
        ">
          <p className="text-[9px] text-yellow-400 uppercase font-bold">
            Role
          </p>

          <p className="
            text-[10px]
            text-white
            font-bold
            truncate
            mt-1
          ">
            {player.player_role || "-"}
          </p>
        </div>


        <div className="
          bg-black/90
          border border-yellow-500
          rounded-lg
          px-2 py-2
          text-center
        ">
          <p className="text-[9px] text-yellow-400 uppercase font-bold">
            Batting
          </p>

          <p className="
            text-[10px]
            text-white
            font-bold
            truncate
            mt-1
          ">
            {player.batting_style || "-"}
          </p>
        </div>


        <div className="
          bg-black/90
          border border-yellow-500
          rounded-lg
          px-2 py-2
          text-center
        ">
          <p className="text-[9px] text-yellow-400 uppercase font-bold">
            Bowling
          </p>

          <p className="
            text-[10px]
            text-white
            font-bold
            truncate
            mt-1
          ">
            {player.bowling_style &&
            player.bowling_style !== "None"
              ? player.bowling_style
              : "-"}
          </p>
        </div>

      </div>

    </div>


    <div className="
      relative
      mx-4
      -mt-1
      z-10
      px-4 py-3
      bg-black
      border-2 border-yellow-500
      text-center
    ">

      <div className="
        absolute left-0 top-1/2
        -translate-x-1/2
        w-3 h-3
        rotate-45
        bg-yellow-500
      " />

      <div className="
        absolute right-0 top-1/2
        translate-x-1/2
        w-3 h-3
        rotate-45
        bg-yellow-500
      " />

      <h2 className="
        text-xl
        sm:text-2xl
        font-black
        uppercase
        tracking-wide
        text-yellow-400
        truncate
      ">
        {player.fullname}
      </h2>

    </div>


    <div className="px-5 py-4">

      <div className="
        flex items-center
        justify-between
        gap-4
      ">

        {player.location && (
          <div className="flex items-center gap-2 min-w-0">

            <div className="
              w-8 h-8
              rounded-full
              bg-yellow-500
              flex items-center
              justify-center
              flex-shrink-0
            ">
              <MapPin className="w-4 h-4 text-black" />
            </div>

            <div className="min-w-0">
              <p className="
                text-[8px]
                uppercase
                text-yellow-500
                font-bold
              ">
                Location
              </p>

              <p className="
                text-xs
                text-white
                font-semibold
                truncate
              ">
                {player.location}
              </p>
            </div>

          </div>
        )}


        {player.contact_no && (
          <div className="flex items-center gap-2 min-w-0">

            <div className="
              w-8 h-8
              rounded-full
              bg-yellow-500
              flex items-center
              justify-center
              flex-shrink-0
            ">
              <Phone className="w-4 h-4 text-black" />
            </div>

            <div className="min-w-0">
              <p className="
                text-[8px]
                uppercase
                text-yellow-500
                font-bold
              ">
                Contact
              </p>

              <p className="
                text-xs
                text-white
                font-semibold
                truncate
              ">
                {player.contact_no}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>


    

    <div className="
      h-1
      bg-yellow-500
    " />

  </div>
</div> */}
      
<div className="group relative overflow-hidden rounded-2xl border-4 border-emerald-600 bg-white shadow-md">

  {/* Player Image */}
  <div className="relative h-80 w-full overflow-hidden bg-slate-100">

    <img
      src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
      alt={player.fullname}
      className="h-full w-full object-contain object-top"
    />

    {/* Dark gradient for overlay readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* Player ID */}
    <div className="absolute left-3 top-3 rounded-lg bg-slate-900/90 px-3 py-1.5 text-sm font-bold text-white">
      #{player.id}
    </div>

    {/* Player Details Overlay */}
    <div className="absolute bottom-4 left-3 right-3">

      <div className="grid grid-cols-3 gap-2">

        {/* Role */}
        <div className="rounded-lg bg-white/90 px-2 py-2 text-center backdrop-blur-sm">
          <p className="text-[9px] font-semibold uppercase text-slate-500">
            Role
          </p>
          <p className="truncate text-xs font-bold text-slate-900">
            {player.player_role}
          </p>
        </div>

        {/* Batting */}
        <div className="rounded-lg bg-white/90 px-2 py-2 text-center backdrop-blur-sm">
          <p className="text-[9px] font-semibold uppercase text-slate-500">
            Batting
          </p>
          <p className="truncate text-xs font-bold text-slate-900">
            {player.batting_style}
          </p>
        </div>

        {/* Bowling */}
        <div className="rounded-lg bg-white/90 px-2 py-2 text-center backdrop-blur-sm">
          <p className="text-[9px] font-semibold uppercase text-slate-500">
            Bowling
          </p>
          <p className="truncate text-xs font-bold text-slate-900">
            {player.bowling_style}
          </p>
        </div>

      </div>
    </div>
  </div>

  {/* Player Information */}
  <div className="px-4 py-3">

    <h3 className="truncate text-lg font-bold uppercase text-slate-900">
      {player.fullname}
    </h3>

    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">

    {/* Phone */}
    <div className="flex items-center gap-1.5 font-bold">
      <span>📞</span>
      <span>{player.contact_no}</span>
    </div>

    {/* Location */}
    <div className="flex min-w-0 items-center gap-1.5 font-bold">
      <span>📍</span>
      <span className="truncate">
        {player.location}
      </span>
    </div>

  </div>

  </div>

</div>




      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-2 border-border max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Player?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{player.fullname}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg sm:text-xl">Edit Player</DialogTitle>
          </DialogHeader>
          <PlayerForm editPlayer={player} onCancel={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerCard;
